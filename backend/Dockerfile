# Etapa 1: Build
FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copiar archivos de Maven
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Descargar dependencias
RUN mvn dependency:go-offline -B

# Copiar código fuente
COPY src ./src

# Compilar la aplicación
RUN mvn clean package -DskipTests

# Etapa 2: Runtime
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copiar el JAR desde la etapa de build
COPY --from=build /app/target/*.jar app.jar

# Exponer el puerto
EXPOSE 8080

# Variables de entorno para PostgreSQL
ENV SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/facturacion_db
ENV SPRING_DATASOURCE_USERNAME=postgres
ENV SPRING_DATASOURCE_PASSWORD=postgres

# Ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
