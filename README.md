# 🚗 Sistema de Control Vehicular — Backend

Este repositorio contiene el **backend** del Sistema de Control Vehicular. Esta parte del sistema es responsable de manejar la lógica del negocio, la conexión con la base de datos y la exposición de endpoints necesarios para el funcionamiento del sistema completo.

---

## 🛠 Requisitos

- Tener instalado **Node.js** en su **versión más reciente**
- Tener acceso a la terminal (cmd, bash, PowerShell, etc.)
- Acceder desde una red privada ya sea de teléfono o distribuidor asociado.

---

## 📦 Instalación

1. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```

---

## ⚙️ Configuración de la base de datos

Antes de iniciar el servidor, debes compilar el esquema de base de datos con Prisma:

```bash
npm run prisma
```

Esto generará el cliente de Prisma y preparará las estructuras necesarias para la conexión con la base de datos.
Es importante considerar que en el env existe ya una instancia de una base de datos alojada en Atlas la cual el IPN tiene bloqueada, por lo que será necesario acceder desde su propia red para evitar inconvenientes.

---

## 🚀 Ejecución en entorno de desarrollo

Inicia el servidor de desarrollo con el siguiente comando:

```bash
npm run dev
```

---

## 📝 Notas

- Este proyecto solo contiene la parte **lógica (backend)**. El frontend se encuentra en un repositorio o carpeta separada.
- Verifica que las variables de entorno estén correctamente configuradas para la conexión con la base de datos.
