CREATE TABLE IF NOT EXISTS users (
    table_id SERIAL NOT NULL PRIMARY KEY,
    public_id VARCHAR(16) NOT NULL UNIQUE CHECK (public_id LIKE 'usr_%'),
    email VARCHAR(255) NOT NULL UNIQUE,
    uname VARCHAR(35) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS projects (
    table_id SERIAL NOT NULL PRIMARY KEY,
    public_id VARCHAR(16) NOT NULL UNIQUE CHECK (public_id LIKE 'prj_%'),
    user_id VARCHAR(16) NOT NULL REFERENCES users(public_id) ON DELETE CASCADE,
    pname VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kbcolumns (
    table_id SERIAL NOT NULL PRIMARY KEY,
    public_id VARCHAR(40) NOT NULL UNIQUE CHECK (public_id LIKE 'kbc_%'),
    project_id VARCHAR(16) NOT NULL REFERENCES projects(public_id) ON DELETE CASCADE,
    kbname VARCHAR(25) NOT NULL,
    kbcolor VARCHAR(7) NOT NULL DEFAULT '#FFFFFF',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
    table_id SERIAL NOT NULL PRIMARY KEY,
    public_id VARCHAR(40) NOT NULL UNIQUE CHECK (public_id LIKE 'tsk_%'),
    project_id VARCHAR(16) NOT NULL REFERENCES projects(public_id) ON DELETE CASCADE,
    kbcolumn_id VARCHAR(40) REFERENCES kbcolumns(public_id) ON DELETE SET NULL,
    title VARCHAR(150) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    edited_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    is_checked BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_kbcolumns_project_id ON kbcolumns(project_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_kbcolumn_id ON tasks(kbcolumn_id);
