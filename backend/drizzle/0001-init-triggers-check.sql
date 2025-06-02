CREATE OR REPLACE FUNCTION trg_receta_historial()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
	IF NEW.nombre IS DISTINCT FROM OLD.nombre THEN
		INSERT INTO "Historial_recetas"(id_receta, atributo_modificado, valor_anterior, valor_nuevo, realizado_en)
		VALUES
			(OLD.id, 'nombre', OLD.nombre, NEW.nombre, CURRENT_TIMESTAMP);
	END IF;

	IF NEW.descripcion IS DISTINCT FROM OLD.descripcion THEN
		INSERT INTO "Historial_recetas"(id_receta, atributo_modificado, valor_anterior, valor_nuevo, realizado_en)
		VALUES
			(OLD.id, 'descripcion', OLD.descripcion, NEW.descripcion, CURRENT_TIMESTAMP);
	END IF;

	RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS receta_historial ON "Recetas";
CREATE TRIGGER receta_historial
AFTER UPDATE ON "Recetas"
FOR EACH ROW
WHEN (OLD.nombre IS DISTINCT FROM NEW.nombre OR OLD.descripcion IS DISTINCT FROM NEW.descripcion)
EXECUTE FUNCTION trg_receta_historial();

CREATE OR REPLACE FUNCTION trg_before_add_valoracion()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
	IF EXISTS (
		SELECT 1
		FROM "Valoraciones" v
		WHERE v.id_receta = NEW.id_receta
		AND v.id_usuario = NEW.id_usuario
	) THEN
		RAISE EXCEPTION 'El usuario % ya valoró la receta %', NEW.id_usuario, NEW.id_receta;
	END IF;
	RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS valoracion_unica ON "Valoraciones";
CREATE TRIGGER valoracion_unica
BEFORE INSERT ON "Valoraciones"
FOR EACH ROW
EXECUTE FUNCTION trg_before_add_valoracion();

CREATE OR REPLACE FUNCTION trg_ingrediente_historial()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
	IF NEW.nombre IS DISTINCT FROM OLD.nombre THEN
		INSERT INTO "Historial_ingredientes" (id_ingrediente, nombre_anterior, nombre_nuevo, realizado_en)
		VALUES
			(OLD.id, OLD.nombre, NEW.nombre, CURRENT_TIMESTAMP);
	END IF;

	RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS ingrediente_historial ON "Ingredientes";
CREATE TRIGGER ingrediente_historial
BEFORE UPDATE ON "Ingredientes"
FOR EACH ROW
WHEN (OLD.nombre IS DISTINCT FROM NEW.nombre)
EXECUTE FUNCTION trg_ingrediente_historial();

CREATE OR REPLACE FUNCTION toggle_favorito(p_id_receta INT, p_id_usuario INT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
	v_existe BOOLEAN;
BEGIN
-- Validar existencia del usuario y receta
	SELECT EXISTS (
		SELECT 1
		FROM "Recetas_favoritas" AS rf
		WHERE rf.id_receta  = p_id_receta
		AND rf.id_usuario = p_id_usuario
	) INTO v_existe;

-- Si existe, se elimina de favoritas
	IF v_existe THEN
		DELETE FROM "Recetas_favoritas"
		WHERE id_receta  = p_id_receta
		AND id_usuario = p_id_usuario;
		RETURN 'ELIMINADO';

-- Si no, la crea
	ELSE
		INSERT INTO "Recetas_favoritas"(id_receta, id_usuario)
		VALUES (p_id_receta, p_id_usuario);
		RETURN 'AGREGADO';
	END IF;
END;
$$;

CREATE OR REPLACE FUNCTION ingredientes_usos()
RETURNS TABLE (
	id_ingrediente INT,
	nombre VARCHAR,
	cant_veces_usado INT
)
LANGUAGE plpgsql
AS $$
BEGIN
	RETURN QUERY
	SELECT
	i.id,
	i.nombre,
	COUNT(ri.id_ingrediente) AS cant_veces_usado
	FROM
	"Ingredientes" AS i
	LEFT JOIN "Receta_ingredientes" AS ri
	ON ri.id_ingrediente = i.id
	GROUP BY
	i.id,
	i.nombre
	ORDER BY
	cant_veces_usado DESC;
END;
$$;

-- CHECKS -- Drizzle lamentablemente no deja definir checks al declarar las entidades
-- toca hacerlas a mano como los triggers

-- 1) En la tabla Recetas: tiempo_completacion > 0
ALTER TABLE "Recetas"
  ADD CONSTRAINT chk_recetas_tiempo_completacion_positive
    CHECK (tiempo_completacion > 0);

-- 2) En la tabla Receta_ingredientes: cantidad > 0
ALTER TABLE "Receta_ingredientes"
  ADD CONSTRAINT chk_receta_ingredientes_cantidad_positive
    CHECK (cantidad > 0);

-- 3) En la tabla Valoraciones: valoracion entre 1 y 5
ALTER TABLE "Valoraciones"
  ADD CONSTRAINT chk_valoraciones_valoracion_range
    CHECK (valoracion BETWEEN 1 AND 5);