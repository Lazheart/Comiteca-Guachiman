from psycopg import Connection
from core.exceptions import NotFoundError

class CopyRepository:
    def __init__(self, conn: Connection):
        self.conn = conn

    def get_all(self):
        with self.conn.cursor() as cur:
            cur.execute("SELECT * FROM Ejemplar")
            return cur.fetchall()

    def get_available(self):
        with self.conn.cursor() as cur:
            cur.execute("SELECT * FROM Ejemplar WHERE disponibilidad = 'Disponible'")
            return cur.fetchall()
            
    def get_by_material(self, material_id: int):
        with self.conn.cursor() as cur:
            cur.execute("SELECT * FROM Ejemplar WHERE material_id = %s", (material_id,))
            return cur.fetchall()
