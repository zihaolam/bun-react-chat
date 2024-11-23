CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    from_id INTEGER NOT NULL REFERENCES accounts(id),
    to_id INTEGER NOT NULL REFERENCES accounts(id),
    content TEXT NOT NULL,
    sent_at TIMESTAMP NOT NULL
) WITHOUT ROWID;
==== breakpoint ====
CREATE INDEX IF NOT EXISTS messages_from_id_idx ON messages(from_id);
==== breakpoint ====
CREATE INDEX IF NOT EXISTS messages_to_id_idx ON messages(to_id);
==== breakpoint ====
CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE
);
==== breakpoint ====
CREATE INDEX IF NOT EXISTS accounts_username_idx ON accounts(username);
==== breakpoint ====
CREATE INDEX IF NOT EXISTS messages_from_to_sent_idx ON messages(from_id, to_id, sent_at);
