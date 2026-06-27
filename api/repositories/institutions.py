from psycopg import Connection
from core.exceptions import NotFoundError

class InstitutionRepository:
    def __init__(self, conn: Connection):
        self.conn = conn

    def get_all(self):
        with self.conn.cursor() as cur:
            cur.execute("SELECT * FROM Institucion")
            return cur.fetchall()

    def get_by_id(self, institution_id: int):
        with self.conn.cursor() as cur:
            cur.execute("SELECT * FROM Institucion WHERE id = %s", (institution_id,))
            row = cur.fetchone()
            if not row:
                raise NotFoundError()
            return row

    def get_donations(self, institution_id: int):
        with self.conn.cursor() as cur:
            cur.execute("SELECT * FROM Donacion WHERE institucion_id = %s", (institution_id,))
            return cur.fetchall()

    def get_sponsored_events(self, institution_id: int):
        with self.conn.cursor() as cur:
            cur.execute("SELECT e.*, p.montoPatrocinio FROM Evento e JOIN Patrocinado p ON e.id = p.evento_id WHERE p.institucion_id = %s", (institution_id,))
            return cur.fetchall()
