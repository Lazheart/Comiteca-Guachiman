from psycopg import Connection
from core.exceptions import NotFoundError

class EventRepository:
    def __init__(self, conn: Connection):
        self.conn = conn

    def get_all(self, date=None, date_from=None, date_to=None):
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
            
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
            
        with self.conn.cursor() as cur:
            cur.execute(query, params)
            return cur.fetchall()

    def get_by_id(self, event_id: int):
        with self.conn.cursor() as cur:
            cur.execute("SELECT * FROM Evento WHERE id = %s", (event_id,))
            row = cur.fetchone()
            if not row:
                raise NotFoundError()
            return row

    def get_upcoming(self):
        with self.conn.cursor() as cur:
            cur.execute("SELECT * FROM Evento WHERE fecha >= CURRENT_DATE ORDER BY fecha, horaInicio")
            return cur.fetchall()
