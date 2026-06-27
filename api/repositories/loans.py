from psycopg import Connection

class LoanRepository:
    def __init__(self, conn: Connection):
        self.conn = conn

    def get_all(self):
        with self.conn.cursor() as cur:
            cur.execute("SELECT * FROM Prestamo")
            return cur.fetchall()

    def get_active(self):
        with self.conn.cursor() as cur:
            cur.execute("SELECT * FROM Prestamo WHERE fechaDevolucion IS NULL")
            return cur.fetchall()
            
    def get_expired(self):
        with self.conn.cursor() as cur:
            cur.execute("SELECT * FROM Prestamo WHERE fechaDevolucion IS NULL AND fechaLimite < CURRENT_DATE")
            return cur.fetchall()

    def get_by_member(self, dni: int):
        with self.conn.cursor() as cur:
            cur.execute("SELECT * FROM Prestamo WHERE miembro_DNI = %s", (dni,))
            return cur.fetchall()
            
    def get_by_material(self, material_id: int):
        with self.conn.cursor() as cur:
            cur.execute("SELECT * FROM Prestamo WHERE material_id = %s", (material_id,))
            return cur.fetchall()
