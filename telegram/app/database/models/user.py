from datetime import datetime, UTC
from sqlalchemy import ForeignKey, String, BigInteger, CheckConstraint, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.models.base import Base
from app.database.models.product import Specs
from app.database.enums.spec import SpecTypeEnum

class Users(Base):
    """Пользователи системы"""
    __tablename__ = "users"
    __table_args__ = {"extend_existing": True}
    
    id: Mapped[int] = mapped_column(primary_key=True)
    telegram_id: Mapped[int] = mapped_column(BigInteger, unique=True)
    first_name: Mapped[str | None] = mapped_column(String(50))
    last_name: Mapped[str | None] = mapped_column(String(50))
    username: Mapped[str | None] = mapped_column(String(50))
    subscribed_until: Mapped[datetime | None]
    is_active: Mapped[bool] = mapped_column(default=True)
    is_bot_active: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.now(UTC))

    user_specs: Mapped[list["UserSpecs"]] = relationship(back_populates="user")
    
    def __repr__(self) -> str:
        return f"User(id={self.id}, telegram_id={self.telegram_id}, username={self.username})"


class UserSpecs(Base):
    """Подписки пользователей на товары"""
    __tablename__ = "user_specs"
    __table_args__ = (
        CheckConstraint(
            f"spec_type IN ('{SpecTypeEnum.SELL.value}', '{SpecTypeEnum.BUY.value}')",
            name="check_spec_type_enum"
        ),
        UniqueConstraint('user_id', 'spec_id', 'spec_type'),
        {"extend_existing": True}
    )
    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    spec_id: Mapped[int] = mapped_column(ForeignKey("specs.id", ondelete="CASCADE"))
    spec_type: Mapped[str] = mapped_column(String(4))
    
    user: Mapped[Users] = relationship(back_populates="user_specs")
    spec: Mapped[Specs] = relationship(back_populates="user_specs")
    
    def __repr__(self) -> str:
        return f"UserSpec(id={self.id}, user_id={self.user_id}, spec_id={self.spec_id})" 