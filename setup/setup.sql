create extension pgcrypto;

create table curso
(
    id     varchar(8) primary key,
    nombre varchar(50) not null
);

create table seccion
(
    id       serial unique,
    seccion  smallint,
    curso_id varchar(8),
    primary key (id, seccion, curso_id),

    constraint fk_curso
        foreign key (curso_id)
            references curso (id)
);

create table carrera
(
    id     smallserial primary key,
    nombre varchar(75) not null
);

create table usuario
(
    carne      integer primary key,
    nombre     varchar(50) not null,
    apellido   varchar(50) not null,
    carrera_id smallint    not null,
    password   varchar(70) not null,

    constraint fk_carrera
        foreign key (carrera_id)
            references carrera (id)
);

create table asiste_seccion
(
    seccion_id    integer,
    usuario_carne integer,
    primary key (seccion_id, usuario_carne),

    constraint fk_seccion
        foreign key (seccion_id)
            references seccion (id),

    constraint fk_usuario
        foreign key (usuario_carne)
            references usuario (carne)
);

create table amistad
(
    amigo1_carne integer,
    amigo2_carne integer check (amigo1_carne > amigo2_carne),
    primary key (amigo1_carne, amigo2_carne),

    constraint fk_amigo1
        foreign key (amigo1_carne)
            references usuario (carne),

    constraint fk_amigo2
        foreign key (amigo2_carne)
            references usuario (carne)
);

create table hobby
(
    id          serial primary key,
    nombre      varchar(50) not null,
    description text        not null
);
create table has_hobby
(
    hobby_id      integer,
    usuario_carne integer,
    primary key (hobby_id, usuario_carne),

    constraint fk_hobby
        foreign key (hobby_id)
            references hobby (id),

    constraint fk_usuario
        foreign key (usuario_carne)
            references usuario (carne)
);

create table plataforma_social
(
    id     smallserial primary key,
    nombre varchar(10) not null
);

create table red_social
(
    usuario_carne integer,
    plataforma_id smallint,
    primary key (usuario_carne, plataforma_id),

    constraint fk_usuario
        foreign key (usuario_carne)
            references usuario (carne),

    constraint fk_plataforma
        foreign key (plataforma_id)
            references plataforma_social (id)
);
