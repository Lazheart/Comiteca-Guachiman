from psycopg import Connection
from core.exceptions import NotFoundError
from core.pagination import execute_paginated_query

class InstitutionRepository:
    def __init__(self, conn: Connection):
        self.conn = conn

    def get_all(self, page=1, page_size=20, search=None, sort_by=None, order='asc'):
        query = "SELECT * FROM Institucion"
        params = []
        if search:
            query += " WHERE nombre ILIKE %s"
            params.append(f'%{search}%')
        return execute_paginated_query(self.conn, query, params, page, page_size, sort_by, order)

    def get_by_id(self, institution_id: int):
        with self.conn.cursor() as cur:
            cur.execute("SELECT * FROM Institucion WHERE id = %s", (institution_id,))
            row = cur.fetchone()
            if not row:
                raise NotFoundError()
            return row

    def get_donations(self, institution_id: int, page=1, page_size=20, search=None, sort_by=None, order='asc'):
        query = "SELECT * FROM Donacion WHERE institucion_id = %s"
        return execute_paginated_query(self.conn, query, [institution_id], page, page_size, sort_by, order)

    def get_sponsored_events(self, institution_id: int, page=1, page_size=20, search=None, sort_by=None, order='asc'):
        query = "SELECT e.*, p.montoPatrocinio FROM Evento e JOIN Patrocinado p ON e.id = p.evento_id WHERE p.institucion_id = %s"
        return execute_paginated_query(self.conn, query, [institution_id], page, page_size, sort_by, order)