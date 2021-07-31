package stmt

const CreateTables = `

CREATE TABLE IF NOT EXISTS island
(
	id         text    PRIMARY KEY,
  name       text    NOT NULL,
  email      text    NOT NULL,
  avatar     text    NOT NULL,
  link       text    NOT NULL,
  note       text    NOT NULL,
  hide_json  int     NOT NULL,
  hide_html  int     NOT NULL
);

CREATE TABLE IF NOT EXISTS message
(
  id           text    PRIMARY KEY,
  island_id    text    REFERENCES island(id) ON DELETE CASCADE,
  time         int     NOT NULL,
  body         text    NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_message_time ON message(time);
CREATE INDEX IF NOT EXISTS idx_message_id_time ON message(id, time);

CREATE TABLE IF NOT EXISTS metadata
(
  name         text    NOT NULL UNIQUE,
  int_value    int     NOT NULL DEFAULT 0,
  text_value   text    NOT NULL DEFAULT "" 
);
`
const InsertIntValue = `INSERT INTO metadata (name, int_value) VALUES (?, ?);`
const GetIntValue = `SELECT int_value FROM metadata WHERE name=?;`
const UpdateIntValue = `UPDATE metadata SET int_value=? WHERE name=?;`

const InsertTextValue = `INSERT INTO metadata (name, text_value) VALUES (?, ?);`
const GetTextValue = `SELECT text_value FROM metadata WHERE name=?;`
const UpdateTextValue = `UPDATE metadata SET text_value=? WHERE name=?;`

const GetIslandByID = `
  SELECT id, name, email, avatar, link, note, hide_json, hide_html
  FROM island WHERE id=?;`

const AllIslands = `
  SELECT id, name, email, avatar, link, note, hide_json, hide_html
  FROM island ORDER BY id DESC;`

const GetMoreMessagesByIsland = `
  SELECT id, island_id, time, body FROM message
  WHERE island_id=? AND time<? ORDER BY time DESC LIMIT ?;`

const GetMoreMessages = `
  SELECT msg.id, island_id, msg.time, msg.body FROM message AS msg
  INNER JOIN island ON msg.island_id = island.id
  WHERE msg.time<? ORDER BY msg.time DESC LIMIT ?;`

const DeleteIsland = `
  DELETE FROM island WHERE id=?;`

const InsertIsland = `
  INSERT INTO island (id, name, email, avatar, link, note, hide_json, hide_html)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?);`

const UpdateIsland = `
  UPDATE island
  SET name=?, email=?, avatar=?, link=?, hide_json=?, hide_html=?
  WHERE id=?;`

const UpdateNote = `
  UPDATE island SET note=? WHERE id=?;`

const InsertMsg = `
  INSERT INTO message (id, island_id, time, body)
  VALUES (?, ?, ?, ?);`

const DeleteMessage = `
  DELETE FROM message WHERE id=?;`

const CountMessages = `
  SELECT count(*) FROM message WHERE island_id=?;`

const CountIsland = `
  SELECT count(*) FROM island WHERE address=?;`