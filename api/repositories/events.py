from psycopg import Connection
from core.exceptions import NotFoundError
from core.pagination import execute_paginated_query

class EventRepository:
    def __init__(self, conn: Connection):
        self.conn = conn

    def get_all(self, date=None, date_from=None, date_to=None, page=1, page_size=20, search=None, sort_by=None, order='asc'):
        query = "SELECT * FROM Evento"
        params = []
        conditions = []
        
        if date:
            conditions.append("fecha = %s")
            params.append(date)
        if date_from:
            conditions.append("fecha >= %s")
            params.append(date_from)
        if date_to:
            conditions.append("fecha <= %s")
            params.append(date_to)
        if search:
            conditions.append("tema ILIKE %s")
            params.append(f'%{search}%')
            
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
            
        return execute_paginated_query(self.conn, query, params, page, page_size, sort_by, order)

    def get_by_id(self, event_id: int):
        with self.conn.cursor() as cur:
            cur.execute("SELECT * FROM Evento WHERE id = %s", (event_id,))
            row = cur.fetchone()
            if not row:
                raise NotFoundError()
            return row

    def get_upcoming(self, page=1, page_size=20, search=None, sort_by=None, order='asc'):
        query = "SELECT * FROM Evento WHERE fecha >= CURRENT_DATE"
        if not sort_by:
            sort_by = "fecha, horaInicio"
        return execute_paginated_query(self.conn, query, [], page, page_size, sort_by, order)