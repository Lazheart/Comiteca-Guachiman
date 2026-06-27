from psycopg import Connection

class ReservationRepository:
    def __init__(self, conn: Connection):
        self.conn = conn

    def get_all(self):
        with self.conn.cursor() as cur:
            cur.execute("SELECT * FROM ReservaGestionada")
            return cur.fetchall()

    def get_pending(self):
        with self.conn.cursor() as cur:
            cur.execute("SELECT * FROM ReservaGestionada WHERE estadoReserva = 'Pendiente'")
            return cur.fetchall()

    def get_by_member(self, dni: int):
        with self.conn.cursor() as cur:
            cur.execute("SELECT * FROM ReservaGestionada WHERE miembro_DNI = %s", (dni,))
            return cur.fetchall()
