create extension if not exists pgcrypto;

create table if not exists curso
(
    id     varchar(8) primary key,
    nombre varchar(50) not null
);

create table if not exists seccion
(
    id       serial unique,
    seccion  smallint,
    curso_id varchar(8) references curso (id) on delete cascade,
    primary key (seccion, curso_id)
);

create table if not exists carrera
(
    id     smallserial primary key,
    nombre varchar(75) not null
);

create table if not exists usuario
(
    carne      integer primary key,
    nombre     varchar(50) not null,
    apellido   varchar(50) not null,
    carrera_id smallint    not null references carrera (id),
    password   varchar(70) not null,
    correo     varchar(30) not null
);

create table if not exists amistad
(
    amigo1_carne integer references usuario (carne) on delete cascade,
    amigo2_carne integer references usuario (carne) on delete cascade,
    primary key (amigo1_carne, amigo2_carne)
);

create table if not exists asiste_seccion
(
    seccion_id    integer references seccion (id) on delete cascade,
    usuario_carne integer references usuario (carne) on delete cascade,
    primary key (seccion_id, usuario_carne)
);

create table if not exists hobby
(
    id          serial primary key,
    nombre      varchar(50) not null,
    description text        not null
);

create table if not exists has_hobby
(
    hobby_id      integer references hobby (id) on delete cascade,
    usuario_carne integer references usuario (carne) on delete cascade,
    primary key (hobby_id, usuario_carne)
);

create table if not exists plataforma_social
(
    id     smallserial primary key,
    nombre varchar(10) not null
);

create table if not exists red_social
(
    usuario_carne integer references usuario (carne) on delete cascade,
    plataforma_id smallint references plataforma_social (id),
    perfil        varchar(20) not null,
    primary key (usuario_carne, plataforma_id)
);

create table if not exists solicitud_amistad
(
    usuario_envia integer references usuario (carne) on delete cascade,
    usuario_recibe integer references usuario (carne) on delete cascade,
    primary key (usuario_envia, usuario_recibe)
);
