CREATE TYPE "public"."Complejidad" AS ENUM('BAJA', 'MEDIA', 'ALTA');--> statement-breakpoint
CREATE TYPE "public"."MomentoComida" AS ENUM('DESAYUNO', 'ALMUERZO', 'CENA', 'POSTRE', 'SNACK');--> statement-breakpoint
CREATE TYPE "public"."NivelPicante" AS ENUM('NULO', 'SUAVE', 'MEDIO', 'FUERTE', 'EXTREMO');--> statement-breakpoint
CREATE TABLE "Alergias" (
	"id" integer PRIMARY KEY NOT NULL,
	"nombre" varchar(50) NOT NULL,
	CONSTRAINT "Alergias_nombre_unique" UNIQUE("nombre")
);
--> statement-breakpoint
CREATE TABLE "Categorias" (
	"id" integer PRIMARY KEY NOT NULL,
	"nombre" varchar(50) NOT NULL,
	CONSTRAINT "Categorias_nombre_unique" UNIQUE("nombre")
);
--> statement-breakpoint
CREATE TABLE "Comentarios" (
	"id" integer PRIMARY KEY NOT NULL,
	"id_receta" integer NOT NULL,
	"id_usuario" integer NOT NULL,
	"comentario" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Historial_ingredientes" (
	"id" integer PRIMARY KEY NOT NULL,
	"id_ingrediente" integer NOT NULL,
	"nombre_anterior" varchar(50) NOT NULL,
	"nombre_nuevo" varchar(50) NOT NULL,
	"hecho_por" integer NOT NULL,
	"realizado_en" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Historial_recetas" (
	"id" integer PRIMARY KEY NOT NULL,
	"id_receta" integer NOT NULL,
	"atributo_modificado" varchar(20) NOT NULL,
	"valor_anterior" varchar(100) NOT NULL,
	"valor_nuevo" varchar(100) NOT NULL,
	"hecho_por" integer NOT NULL,
	"realizado_en" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Ingredientes" (
	"id" integer PRIMARY KEY NOT NULL,
	"nombre" varchar(50) NOT NULL,
	CONSTRAINT "Ingredientes_nombre_unique" UNIQUE("nombre")
);
--> statement-breakpoint
CREATE TABLE "Receta_alergias" (
	"id_receta" integer NOT NULL,
	"id_alergia" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Receta_categorias" (
	"id_receta" integer NOT NULL,
	"id_categoria" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Receta_ingredientes" (
	"id_receta" integer NOT NULL,
	"id_ingrediente" integer NOT NULL,
	"id_unidades" integer NOT NULL,
	"cantidad" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Receta_utensilios" (
	"id_receta" integer NOT NULL,
	"id_utensilio" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Recetas_favoritas" (
	"id_receta" integer NOT NULL,
	"id_usuario" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Recetas" (
	"id" integer PRIMARY KEY NOT NULL,
	"nombre" varchar(70) NOT NULL,
	"descripcion" varchar(100) NOT NULL,
	"complejidad" "Complejidad" DEFAULT 'MEDIA' NOT NULL,
	"momento_comida" "MomentoComida" NOT NULL,
	"nivel_picante" "NivelPicante" DEFAULT 'NULO' NOT NULL,
	"fecha_creacion" integer NOT NULL,
	"tiempo_completacion" integer NOT NULL,
	"creado_por" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Unidades" (
	"id" integer PRIMARY KEY NOT NULL,
	"nombre" varchar(10) NOT NULL,
	CONSTRAINT "Unidades_nombre_unique" UNIQUE("nombre")
);
--> statement-breakpoint
CREATE TABLE "Usuarios" (
	"id" integer PRIMARY KEY NOT NULL,
	"username" varchar(20) NOT NULL,
	"password" varchar(50) NOT NULL,
	CONSTRAINT "Usuarios_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "Utensilios" (
	"id" integer PRIMARY KEY NOT NULL,
	"nombre" varchar(50) NOT NULL,
	"descripcion" varchar(100) NOT NULL,
	CONSTRAINT "Utensilios_nombre_unique" UNIQUE("nombre")
);
--> statement-breakpoint
CREATE TABLE "Valoraciones" (
	"id" integer PRIMARY KEY NOT NULL,
	"id_receta" integer NOT NULL,
	"id_usuario" integer NOT NULL,
	"valoracion" integer NOT NULL
);


CREATE OR REPLACE FUNCTION trg_receta_historial()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
	IF NEW.nombre IS DISTINCT FROM OLD.nombre THEN
		INSERT INTO Historial_receta
			(id_receta, atributo_modificado, valor_anterior, valor_nuevo, hecho_por)
		VALUES
			(OLD.id, 'nombre', OLD.nombre, NEW.nombre, NEW.creado_por);
	END IF;
  
	IF NEW.descripcion IS DISTINCT FROM OLD.descripcion THEN
		INSERT INTO Historial_receta
			(id_receta, atributo_modificado, valor_anterior, valor_nuevo, hecho_por)
		VALUES
			(OLD.id, 'descripcion', OLD.descripcion, NEW.descripcion, NEW.creado_por);
	END IF;

	RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS receta_historial ON Recetas;
CREATE TRIGGER receta_historial
AFTER UPDATE ON Recetas
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
		FROM Valoraciones v
		WHERE v.id_receta = NEW.id_receta
		AND v.id_usuario = NEW.id_usuario
	) THEN
		RAISE EXCEPTION 'El usuario % ya valoró la receta %', NEW.id_usuario, NEW.id_receta;
	END IF;
	RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS valoracion_unica ON Valoraciones;
CREATE TRIGGER valoracion_unica
BEFORE INSERT ON Valoraciones
FOR EACH ROW
EXECUTE FUNCTION trg_before_add_valoracion();

CREATE OR REPLACE FUNCTION trg_ingrediente_historial()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
	IF NEW.nombre IS DISTINCT FROM OLD.nombre THEN
		INSERT INTO Historial_ingredientes
			(id_ingrediente, nombre_anterior, nombre_nuevo, hecho_por)
		VALUES
			(OLD.id, OLD.nombre, NEW.nombre, NEW.id_usuario); 
	END IF;

	RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS ingrediente_historial ON Ingredientes;
CREATE TRIGGER ingrediente_historial
BEFORE UPDATE ON Ingredientes
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
		FROM Recetas_favoritas AS rf
		WHERE rf.id_receta  = p_id_receta
		AND rf.id_usuario = p_id_usuario
	) INTO v_existe;

-- Si existe, se elimina de favoritas
	IF v_existe THEN
		DELETE FROM Recetas_favoritas
		WHERE id_receta  = p_id_receta
		AND id_usuario = p_id_usuario;
		RETURN 'ELIMINADO';

-- Si no, la crea
	ELSE
		INSERT INTO Recetas_favoritas(id_receta, id_usuario)
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
	Ingredientes AS i
	LEFT JOIN Receta_ingredientes AS ri
	ON ri.id_ingrediente = i.id
	GROUP BY
	i.id,
	i.nombre
	ORDER BY
	cant_veces_usado DESC;
END;
$$;