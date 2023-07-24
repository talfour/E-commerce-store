import random

import factory
from django.contrib.auth import get_user_model
from faker import Faker

from .models import Brand, Category, Product, Review

fake = Faker()

product_names = [
    "Smartphone",
    "Laptop",
    "Headphones",
    "Smart Watch",
    "Television",
    "Camera",
    "Tablet",
    "Gaming Console",
    "Fitness Tracker",
    "Wireless Earbuds",
    "Robot Vacuum",
    "Bluetooth Speaker",
    "Drone",
    "E-reader",
    "Portable Charger",
    "Action Camera",
    "Projector",
    "Gaming Mouse",
    "Electric Toothbrush",
    "Bluetooth Earphones",
]

top_level_categories = [
    "Electronics",
    "Fashion",
    "Home & Kitchen",
    "Sports & Outdoors",
    "Beauty & Personal Care",
    "Toys & Games",
    "Books & Stationery",
]


class BrandFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Brand

    name = factory.LazyAttribute(lambda _: fake.company())


class CategoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Category

    name = factory.Iterator(top_level_categories)
    parent = None

    @factory.post_generation
    def nested_categories(self, create, extracted, **kwargs):
        if not create or not self.name == "Electronics":
            return

        if extracted:
            for _ in range(extracted):
                CategoryFactory(parent=self, name=fake.word())


class ProductFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Product

    name = factory.LazyAttribute(lambda _: random.choice(product_names))
    description = factory.LazyAttribute(lambda _: fake.paragraph())
    brand = factory.Iterator(Brand.objects.all())
    category = factory.Iterator(Category.objects.all())
    price = factory.LazyAttribute(
        lambda _: fake.pydecimal(left_digits=3, right_digits=2, positive=True)
    )
    available = factory.LazyAttribute(lambda _: fake.boolean(chance_of_getting_true=80))

    @factory.post_generation
    def create_reviews(self, create, extracted, **kwargs):
        if not create:
            return

        num_reviews = random.randint(2, 10)

        total_rating = 0

        for _ in range(num_reviews):
            review = ReviewFactory(product=self)
            total_rating += review.rating

        self.num_reviews = num_reviews
        self.rating = round(total_rating / num_reviews, 2)


class ReviewFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Review

    product = factory.SubFactory(ProductFactory)
    user = factory.LazyFunction(lambda: get_user_model().objects.order_by("?").first())
    rating = factory.LazyAttribute(lambda _: random.randint(1, 5))
    comment = factory.LazyAttribute(lambda _: fake.paragraph())
