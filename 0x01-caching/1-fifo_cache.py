#!/usr/bin/env python3
"""
FIFO CACHING
"""

from base_caching import BaseCaching
from collections import OrderedDict


class FIFOCache(BaseCaching):
    """FIFO caching system"""
    def __init__(self):
        """Class initialization"""
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """item to cache"""
        if key is None or item is None:
            return
        self.cache_data[key] = item
        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            first_key, _ = self.cache_data.popitem(False)
            print("DISCARD:", first_key)

    def get(self, key):
        """Retrieve an item"""
        return self.cache_data.get(key, None)
