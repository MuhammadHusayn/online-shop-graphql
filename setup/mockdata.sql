-- users mock data
insert into users (username, password, contact, email, is_admin) values
('ali', crypt('1111', gen_salt('bf')), '998941024591', 'ali@gmail.com', true),
('hafsa', crypt('1111', gen_salt('bf')), '998941397412', 'hafsa@gmail.com', false),
('hikmat', crypt('1111', gen_salt('bf')), '998902659489', 'hikmat@gmail.com', false),
('alisher', crypt('1111', gen_salt('bf')), '998941023685', null, false);