-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema pet_me
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema pet_me
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `pet_me` DEFAULT CHARACTER SET utf8 ;
USE `pet_me` ;

-- -----------------------------------------------------
-- Table `pet_me`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pet_me`.`usuario` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `apellido` VARCHAR(80) NOT NULL,
  `email` VARCHAR(50) NOT NULL,
  `username` VARCHAR(60) NOT NULL,
  `password` VARCHAR(20) NOT NULL,
  `telefono` VARCHAR(30) NOT NULL,
  `estado` VARCHAR(45) NOT NULL,
  `ciudad` VARCHAR(50) NOT NULL,
  `foto_perfil` VARCHAR(45) NOT NULL,
  `fecha_registro` DATETIME NOT NULL,
  `activo` TINYINT NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE INDEX `id_usuario_UNIQUE` (`id_usuario` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
  UNIQUE INDEX `telefono_UNIQUE` (`telefono` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pet_me`.`mascotas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pet_me`.`mascotas` (
  `id_mascotas` INT NOT NULL AUTO_INCREMENT,
  `nombre_mascota` VARCHAR(45) NOT NULL,
  `especie` ENUM('perro', 'gato') NOT NULL,
  `edad` INT NOT NULL,
  `tamaño` ENUM('pequeño', 'mediano', 'grande') NOT NULL,
  `sexo` ENUM('macho', 'hembra') NOT NULL,
  `descripcion` TEXT(150) NOT NULL,
  `foto_principal` VARCHAR(45) NOT NULL,
  `estado_adopcion` ENUM('disponible', 'en_proceso', 'adoptado') NOT NULL,
  `fecha_publicacion` DATETIME NOT NULL,
  `fecha_actualizacion` DATETIME NOT NULL,
  `usuario_id_usuario` INT NOT NULL,
  PRIMARY KEY (`id_mascotas`, `usuario_id_usuario`),
  UNIQUE INDEX `id_mascotas_UNIQUE` (`id_mascotas` ASC) VISIBLE,
  UNIQUE INDEX `foto_principal_UNIQUE` (`foto_principal` ASC) VISIBLE,
  INDEX `fk_mascotas_usuario_idx` (`usuario_id_usuario` ASC) VISIBLE,
  CONSTRAINT `fk_mascotas_usuario`
  FOREIGN KEY (`usuario_id_usuario`)
  REFERENCES `pet_me`.`usuario` (`id_usuario`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pet_me`.`fotos_mascotas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pet_me`.`fotos_mascotas` (
  `id_fotosmascotas` INT NOT NULL AUTO_INCREMENT,
  `url_foto` VARCHAR(45) NOT NULL,
  `orden` INT NOT NULL,
  `fecha_subida` DATETIME NOT NULL,
  `mascotas_id_mascotas` INT NOT NULL,
  `mascotas_usuario_id_usuario` INT NOT NULL,
  PRIMARY KEY (`id_fotosmascotas`, `mascotas_id_mascotas`, `mascotas_usuario_id_usuario`),
  INDEX `fk_fotos_mascotas_mascotas1_idx` (`mascotas_id_mascotas` ASC, `mascotas_usuario_id_usuario` ASC) VISIBLE,
  CONSTRAINT `fk_fotos_mascotas_mascotas1`
    FOREIGN KEY (`mascotas_id_mascotas` , `mascotas_usuario_id_usuario`)
    REFERENCES `pet_me`.`mascotas` (`id_mascotas` , `usuario_id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pet_me`.`notificaciones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pet_me`.`notificaciones` (
  `id_notificaciones` INT NOT NULL AUTO_INCREMENT,
  `tipo` ENUM('mensaje', 'adopcion', 'sistema') NOT NULL,
  `titulo` VARCHAR(50) NOT NULL,
  `contenido` TEXT NOT NULL,
  `leida` TINYINT NOT NULL,
  `url_relacionada` VARCHAR(45) NOT NULL,
  `fecha_creacion` DATETIME NOT NULL,
  `usuario_id_usuario` INT NOT NULL,
  PRIMARY KEY (`id_notificaciones`, `usuario_id_usuario`),
  UNIQUE INDEX `id_perfil_UNIQUE` (`id_notificaciones` ASC) VISIBLE,
  INDEX `fk_notificaciones_usuario1_idx` (`usuario_id_usuario` ASC) VISIBLE,
  CONSTRAINT `fk_notificaciones_usuario1`
    FOREIGN KEY (`usuario_id_usuario`)
    REFERENCES `pet_me`.`usuario` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pet_me`.`favoritos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pet_me`.`favoritos` (
  `id_favoritos` INT NOT NULL,
  `fecha_agregado` DATETIME NOT NULL,
  PRIMARY KEY (`id_favoritos`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pet_me`.`adopciones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pet_me`.`adopciones` (
  `id_adopciones` INT NOT NULL AUTO_INCREMENT,
  `fecha_solicitud` DATETIME NOT NULL,
  `fecha_aprobacion` DATETIME NOT NULL,
  `estado` ENUM('pendiente', 'aprobada', 'rechazada', 'completada') NOT NULL,
  `comentarios` TEXT NOT NULL,
  `fk_mascotas` INT NOT NULL,
  `fk_publicador_mascotas` INT NOT NULL,
  `fk_usuario_adoptante` INT NOT NULL,
  PRIMARY KEY (`id_adopciones`, `fk_mascotas`, `fk_publicador_mascotas`, `fk_usuario_adoptante`),
  INDEX `fk_adopciones_mascotas1_idx` (`fk_mascotas` ASC, `fk_publicador_mascotas` ASC) VISIBLE,
  INDEX `fk_adopciones_usuario1_idx` (`fk_usuario_adoptante` ASC) VISIBLE,
  CONSTRAINT `fk_adopciones_mascotas1`
    FOREIGN KEY (`fk_mascotas` , `fk_publicador_mascotas`)
    REFERENCES `pet_me`.`mascotas` (`id_mascotas` , `usuario_id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_adopciones_usuario1`
    FOREIGN KEY (`fk_usuario_adoptante`)
    REFERENCES `pet_me`.`usuario` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pet_me`.`publicaciones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pet_me`.`publicaciones` (
  `id_publicaciones` INT NOT NULL,
  `titulo_publicaciones` VARCHAR(45) NOT NULL,
  `tipo` ENUM('adopcion', 'historia', 'consejo', 'otro') NOT NULL,
  `fecha_publicacion` DATETIME NOT NULL,
  `likes` INT NOT NULL,
  `usuario_id_usuario` INT NOT NULL,
  `mascotas_id_mascotas` INT NOT NULL,
  `mascotas_usuario_id_usuario` INT NOT NULL,
  PRIMARY KEY (`id_publicaciones`, `usuario_id_usuario`, `mascotas_id_mascotas`, `mascotas_usuario_id_usuario`),
  INDEX `fk_publicaciones_usuario1_idx` (`usuario_id_usuario` ASC) VISIBLE,
  INDEX `fk_publicaciones_mascotas1_idx` (`mascotas_id_mascotas` ASC, `mascotas_usuario_id_usuario` ASC) VISIBLE,
  CONSTRAINT `fk_publicaciones_usuario1`
    FOREIGN KEY (`usuario_id_usuario`)
    REFERENCES `pet_me`.`usuario` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_publicaciones_mascotas1`
    FOREIGN KEY (`mascotas_id_mascotas` , `mascotas_usuario_id_usuario`)
    REFERENCES `pet_me`.`mascotas` (`id_mascotas` , `usuario_id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pet_me`.`mensajes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pet_me`.`mensajes` (
  `id_mensajes` INT NOT NULL AUTO_INCREMENT,
  `mensaje` TEXT NOT NULL,
  `leido` TINYINT NOT NULL,
  `fecha_envio` DATE NOT NULL,
  PRIMARY KEY (`id_mensajes`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pet_me`.`mensajes_has_usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pet_me`.`mensajes_has_usuario` (
  `fk_remitente` INT NOT NULL,
  `fk_destinatario` INT NOT NULL,
  INDEX `fk_mensajes_has_usuario_usuario1_idx` (`fk_destinatario` ASC) VISIBLE,
  INDEX `fk_mensajes_has_usuario_mensajes1_idx` (`fk_remitente` ASC) VISIBLE,
  PRIMARY KEY (`fk_destinatario`, `fk_remitente`),
  CONSTRAINT `fk_mensajes_has_usuario_mensajes1`
    FOREIGN KEY (`fk_remitente`)
    REFERENCES `pet_me`.`mensajes` (`id_mensajes`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_mensajes_has_usuario_usuario1`
    FOREIGN KEY (`fk_destinatario`)
    REFERENCES `pet_me`.`usuario` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pet_me`.`favoritos_has_mascotas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pet_me`.`favoritos_has_mascotas` (
  `favoritos_id_favoritos` INT NOT NULL,
  `mascotas_id_mascotas` INT NOT NULL,
  `mascotas_usuario_id_usuario` INT NOT NULL,
  PRIMARY KEY (`favoritos_id_favoritos`, `mascotas_id_mascotas`, `mascotas_usuario_id_usuario`),
  INDEX `fk_favoritos_has_mascotas_mascotas1_idx` (`mascotas_id_mascotas` ASC, `mascotas_usuario_id_usuario` ASC) VISIBLE,
  INDEX `fk_favoritos_has_mascotas_favoritos1_idx` (`favoritos_id_favoritos` ASC) VISIBLE,
  CONSTRAINT `fk_favoritos_has_mascotas_favoritos1`
    FOREIGN KEY (`favoritos_id_favoritos`)
    REFERENCES `pet_me`.`favoritos` (`id_favoritos`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_favoritos_has_mascotas_mascotas1`
    FOREIGN KEY (`mascotas_id_mascotas` , `mascotas_usuario_id_usuario`)
    REFERENCES `pet_me`.`mascotas` (`id_mascotas` , `usuario_id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pet_me`.`favoritos_has_usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pet_me`.`favoritos_has_usuario` (
  `favoritos_id_favoritos` INT NOT NULL,
  `usuario_id_usuario` INT NOT NULL,
  PRIMARY KEY (`favoritos_id_favoritos`, `usuario_id_usuario`),
  INDEX `fk_favoritos_has_usuario_usuario1_idx` (`usuario_id_usuario` ASC) VISIBLE,
  INDEX `fk_favoritos_has_usuario_favoritos1_idx` (`favoritos_id_favoritos` ASC) VISIBLE,
  CONSTRAINT `fk_favoritos_has_usuario_favoritos1`
    FOREIGN KEY (`favoritos_id_favoritos`)
    REFERENCES `pet_me`.`favoritos` (`id_favoritos`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_favoritos_has_usuario_usuario1`
    FOREIGN KEY (`usuario_id_usuario`)
    REFERENCES `pet_me`.`usuario` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
