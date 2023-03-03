ALTER TABLE users
ALTER COLUMN password TYPE VARCHAR(100);

-- CREATE SEQUENCE user_id_seq START WITH (SELECT MAX(id) + 1 FROM user);
-- ALTER TABLE user ALTER COLUMN id SET DEFAULT nextval('user_id_seq');


