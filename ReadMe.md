# Manejador de Recetas

Esta es una aplicacion **full-stack** para administrar recetas e ingredientes. El stack tecnologico del proyecto es el siguiente:

- **Backend**: Express con Drizzle-ORM y PostgreSQL.
- **Frontend**: React + TailwindCSS

Se utilizan contenedores de Docker para poder levantar rapidamente la base de datos, el servidor y la interfaz grafica.

---

## Caracteristicas Principales

- **CRUD de Recetas**:

1. Crear, leer, actualizar (nombre o descripcion) y eliminar recetas.
2. Al crar podras definir la complejidad, momento de comida, nivel de picante y tiempo de preparacion de la receta.
3. Puedes relacionar varios ingredintes, utensilios y alergias a una receta.
4. Las recetas se pueden marcar y desmarcar como favoritas.
5. Puedes darle click al nombre de una receta para visualizar la informacion detallada de una receta y un historial de cambios que se han dado, esto a traves de un modal.

- **CRUD de Ingredientes**:

1. Crear, leer, actualizar (nombre), y eliminar ingredientes.
2. Los ingredientes se listan con la cantidad de recetas a las que estan asociados.
3. Puedes seleccionar el nombre para ver el hisotrial de cambios de nombre.

- **Manejo de Usuarios**:

Puedes interactuar con las recetas utilizando diferentes usuarios, por default tendras el usuario 1, pero puedes seleccionar algun otro con el dropdown. Esto afectara las recetas que veras marcadas como favoritas, ademas, que si quieres poner una valoracion para una receta, debes tomar en cuenta que esto solo lo puedes realizar una vez para una receta con un usuario, esto se valida mediante un trigger. Tambien, si creas alguna receta esta aparece al nombre de tu usuario seleccionado.

- **Historial de Cambios**:

Tanto el de ingredientes, como el de recetas funcionan mediante triggers after udpate, que lo que hacen es que cuando se registra un cambio en el nombre o descripcion, hace un insert sobre la tabla de historial, y aqui se podra evidenciar el valor original contra el que se acaba de colocar.

--- 

## Funcionamiento del Sistema

**Lectura de Ingredientes**

![Lectura de Ingrediente](resources/read_ing.png)

**Edicion Nombre Ingredientes**

![Edicion de Ingrediente](resources/update_ing.png)

![Edicion de Ingrediente](resources/update1_ing.png)

**Crear Ingrediente**

![CrearIngrediente](resources/create_ing.png)

**Borrar Ingrediente**

![BorrarIngrediente](resources/del_ing.png)

**Crear Receta**

![CrearReceta](resources/create_rec.png)

**Actualizar Receta**

![ActualizarReceta](resources/update_rec.png)

![ActualizarReceta](resources/update2_rec.png)

**Leer Receta**

![LeerReceta](resources/lect_rec.png)

**Borrar Receta**

![BorrarReceta](resources/del1_rec.png)

![BorrarReceta](resources/del2_rec.png)

## Correr el Sistema

Se debe contar con docker instalado para poder levantar los contenedores y asi probar la aplicacion.

**Pasos a Seguir:**

1. Guardar el docker-compose.example.yml como docker-compose.yml, y aqui se pueden actualizar los puertos que se utilizan en el contenedor, los que se utilizaran de forma local se definen en el .env

```bash
# Guardar el archivo de ejemplo como archivo de configuración activo
cp docker-compose.example.yml docker-compose.yml
```

2. Guardar el .env.example como .env , y aqui se debe garantizar que los puertos que se dejen configurados sean los adecuados para tu maquina (mas que todo para evitar tomar uno que ya este ocupado).

```bash
cp .env.example .env
```

Tras esto, lo unico que se debe hacer, es correr el comando:

`docker-compose up --build`
