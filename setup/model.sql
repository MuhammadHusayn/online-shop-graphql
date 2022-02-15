create database online_shop;

create extension pgcrypto;

drop table if exists users cascade;
create table users (
	user_id serial not null primary key,
	username character varying(30) not null unique,
	password character varying(256) not null,
	contact character varying(12) not null,
	email character varying(256),
	is_admin boolean default false,
	user_created_at timestamp default current_timestamp,
	user_deleted_at timestamp default null
);

drop table if exists categories cascade;
create table categories (
	category_id serial not null primary key,
	category_name character varying(256) not null,
	category_created_at timestamp default current_timestamp,
	category_deleted_at timestamp default null
);

drop table if exists products cascade;
create table products (
	product_id serial not null primary key,
	product_name character varying(256) not null,
	product_img character varying(256) not null,
	product_price decimal(10, 2) not null,
	product_short_description character varying(256) not null,
	product_long_description text,
	category_id int not null references categories(category_id),
	product_created_at timestamp default current_timestamp,
	product_deleted_at timestamp default null
);

drop table if exists orders cascade;
create table orders (
	order_id serial not null primary key,
	user_id int not null references users(user_id),
	is_paid boolean default false,
	order_created_at timestamp default current_timestamp,
	order_deleted_at timestamp default null
);


drop table if exists order_products cascade;
create table order_products (
	order_product_id serial not null primary key,
	order_id int not null references orders(order_id),
	product_id int not null references products(product_id),
	count int not null default 1,
	order_product_created_at timestamp default current_timestamp,
	order_product_deleted_at timestamp default null
);

/*
	users
	categories
	products
	orders


	1 order
		2 sholcha
		1 laptop
		3 mouse
*/