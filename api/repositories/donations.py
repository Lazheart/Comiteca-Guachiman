from psycopg import Connection

class DonationRepository:
    def __init__(self, conn: Connection):
        self.conn = conn

    def get_all(self):
        with self.conn.cursor() as cur:
            cur.execute("SELECT * FROM vista_auditoria_donaciones")
            return cur.fetchall()

    def get_statistics(self):
        with self.conn.cursor() as cur:
            cur.execute("""
                SELECT 
                    institucion_donante, 
                    SUM(ejemplares_donados) as total_ejemplares,
                    COUNT(*) as numero_donaciones
                FROM vista_auditoria_donaciones 
                GROUP BY institucion_donante
                ORDER BY total_ejemplares DESC
            """)
            return cur.fetchall()
