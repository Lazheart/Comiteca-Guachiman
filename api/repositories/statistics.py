from psycopg import Connection

class StatisticsRepository:
    def __init__(self, conn: Connection):
        self.conn = conn

    def get_most_loaned_materials(self):
        with self.conn.cursor() as cur:
            cur.execute("""
                SELECT m.titulo, COUNT(p.id) as total_prestamos
                FROM Material m
                JOIN Prestamo p ON m.id = p.material_id
                GROUP BY m.titulo
                ORDER BY total_prestamos DESC
                LIMIT 10
            """)
            return cur.fetchall()

    def get_events_attendance(self):
        with self.conn.cursor() as cur:
            cur.execute("""
                SELECT e.tema, e.fecha, COUNT(a.visitante_DNI) as total_asistentes
                FROM Evento e
                LEFT JOIN Asistencia a ON e.id = a.evento_id
                GROUP BY e.id, e.tema, e.fecha
                ORDER BY total_asistentes DESC
            """)
            return cur.fetchall()

    def get_material_availability(self):
        with self.conn.cursor() as cur:
            cur.execute("""
                SELECT m.titulo, e.disponibilidad, COUNT(*) as cantidad
                FROM Material m
                JOIN Ejemplar e ON m.id = e.material_id
                GROUP BY m.titulo, e.disponibilidad
            """)
            return cur.fetchall()

    def get_top_donors(self):
        with self.conn.cursor() as cur:
            cur.execute("""
                SELECT institucion_donante, SUM(ejemplares_donados) as total_ejemplares
                FROM vista_auditoria_donaciones
                GROUP BY institucion_donante
                ORDER BY total_ejemplares DESC
                LIMIT 10
            """)
            return cur.fetchall()

    def get_sanctions(self):
        with self.conn.cursor() as cur:
            cur.execute("""
                SELECT s.motivo, COUNT(*) as cantidad
                FROM Sancion s
                GROUP BY s.motivo
                ORDER BY cantidad DESC
            """)
            return cur.fetchall()

    def get_overdue_loans(self):
        with self.conn.cursor() as cur:
            cur.execute("SELECT * FROM vista_prestamos_alertas WHERE estado_tiempo_real = 'ALERTA: VENCIDO'")
            return cur.fetchall()
