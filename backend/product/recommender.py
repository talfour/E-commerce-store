import redis
from core.models import Product
from django.conf import settings

r = redis.StrictRedis(
    host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=settings.REDIS_DB
)


class Recommender:
    """A class for providing product recommendations based on user purchases."""

    def get_product_key(self, id):
        """Get the key for storing the sorted set of products purchased with a given product."""
        return "product:{}:purchased_with".format(id)

    def products_bought(self, products):
        """
        Update the purchase history for each product with the products they were bought together.
        """
        product_ids = [p.id for p in products]
        for product_id in product_ids:
            with_ids = [id for id in product_ids if id != product_id]
            if with_ids:
                for with_id in with_ids:
                    r.zincrby(self.get_product_key(product_id), 1, with_id)

    def suggest_products_for(self, products, max_results=5):
        """
        Get product recommendations based on the given products.
        Returns a list of Product objects representing the recommended products.
        """
        product_ids = [p.id for p in products]
        if len(products) == 1:
            suggestions = r.zrange(
                self.get_product_key(product_ids[0]), 0, -1, desc=True
            )[:max_results]
        else:
            flat_ids = "".join([str(id) for id in product_ids])
            tmp_key = "tmp_{}".format(flat_ids)
            keys = [self.get_product_key(id) for id in product_ids]
            r.zunionstore(tmp_key, keys)
            r.zrem(tmp_key, *product_ids)
            suggestions = r.zrange(tmp_key, 0, -1, desc=True)[:max_results]
            r.delete(tmp_key)
        suggested_products_ids = [int(id) for id in suggestions]
        suggested_products = list(Product.objects.filter(id__in=suggested_products_ids))
        suggested_products.sort(key=lambda x: suggested_products_ids.index(x.id))
        return suggested_products

    def clear_purchases(self):
        """Clear the purchase history for all products."""
        for id in Product.objects.values_list("id", flat=True):
            r.delete(self.get_product_key(id))
