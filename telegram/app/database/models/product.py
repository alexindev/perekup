from typing import TYPE_CHECKING
from sqlalchemy import ForeignKey, String, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.models.base import Base

if TYPE_CHECKING:
    from app.database.models.user import UserSpecs

class Categories(Base):
    """Категории товаров"""
    __tablename__ = "categories"
    __table_args__ = {"extend_existing": True}
    
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    
    # Отношения
    models: Mapped[list["Models"]] = relationship(back_populates="category")
    
    def __repr__(self) -> str:
        return f"Category(id={self.id}, name={self.name})"


class Models(Base):
    """Модели товаров"""
    __tablename__ = "models"
    __table_args__ = (
        Index('idx_models_category_id', 'category_id'),
        {"extend_existing": True}
    )
    
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id", ondelete="CASCADE"))
    
    # Отношения
    category: Mapped["Categories"] = relationship(back_populates="models")
    specs: Mapped[list["Specs"]] = relationship(back_populates="model")
    
    def __repr__(self) -> str:
        return f"Model(id={self.id}, name={self.name}, category_id={self.category_id})"


class Specs(Base):
    """Спецификации товаров"""
    __tablename__ = "specs"
    __table_args__ = (
        Index('idx_specs_model_id', 'model_id'),
        {"extend_existing": True}
    )
    
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    model_id: Mapped[int] = mapped_column(ForeignKey("models.id", ondelete="CASCADE"))
    
    # Отношения
    model: Mapped["Models"] = relationship(back_populates="specs")
    keywords: Mapped[list["Keywords"]] = relationship(back_populates="spec")
    user_specs: Mapped[list["UserSpecs"]] = relationship("UserSpecs", back_populates="spec")
    
    def __repr__(self) -> str:
        return f"Spec(id={self.id}, name={self.name}, model_id={self.model_id})"


class Keywords(Base):
    """Ключевые слова для спецификаций товаров"""
    __tablename__ = "keywords"
    __table_args__ = (
        Index('idx_keywords_spec_id', 'spec_id'),
        {"extend_existing": True}
    )
    
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    spec_id: Mapped[int] = mapped_column(ForeignKey("specs.id", ondelete="CASCADE"))
    
    # Отношения
    spec: Mapped["Specs"] = relationship(back_populates="keywords")
    
    def __repr__(self) -> str:
        return f"Keyword(id={self.id}, name={self.name}, spec_id={self.spec_id})" 