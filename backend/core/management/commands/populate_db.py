from core.factories import BrandFactory, CategoryFactory, ProductFactory
from core.models import Category
from django.core.management.base import BaseCommand

nested_categories_electronics = [
    "Smartphones",
    "Laptops",
    "Headphones",
    "Cameras",
    "Tablets",
]


class Command(BaseCommand):
    """Django command to populate database"""

    def handle(self, *args, **options):
        self.stdout.write("Populating database...")
        BrandFactory.create_batch(5)
        CategoryFactory.create_batch(5)
        CategoryFactory(nested_categories=3)
        # Manually create some nested categories under "Electronics"
        electronics_category = Category.objects.filter(name="Electronics").first()
        if electronics_category:
            for name in nested_categories_electronics:
                CategoryFactory(
                    name=name, parent=Category.objects.get(name="Electronics")
                )

        ProductFactory.create_batch(50, create_reviews=True)

        self.stdout.write(self.style.SUCCESS("Database populated!"))
