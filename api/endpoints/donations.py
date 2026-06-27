from fastapi import APIRouter, Depends
from core.config import get_db_connection
from repositories.donations import DonationRepository
from psycopg import Connection

router = APIRouter(prefix="/donations", tags=["Donations"])

@router.get("")
def get_donations(conn: Connection = Depends(get_db_connection)):
    repo = DonationRepository(conn)
    return repo.get_all()

@router.get("/statistics")
def get_donation_statistics(conn: Connection = Depends(get_db_connection)):
    repo = DonationRepository(conn)
    return repo.get_statistics()
