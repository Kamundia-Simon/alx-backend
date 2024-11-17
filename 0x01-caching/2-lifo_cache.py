#!/usr/bin/env python3
"""
LIFOcache
"""

from base_caching import BaseCaching
from collections import OrderedDict


class LIFOCache(BaseCaching):
    """ LIFOCache that inherits from BaseCaching and is a caching system"""
    def __init__(self):
        """class initialization"""
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """item to cache"""
        if key is None or item is None:
            return
        if key not in self.cache_data:
            if len(self.cache_data) + 1 > BaseCaching.MAX_ITEMS:
                last_key, _ = self.cache_data.popitem(True)
                print("DISCARD:", last_key)
        self.cache_data[key] = item
        self.cache_data.move_to_end(key, last=True)

    def get(self, key):
        """Retrieve an item"""
        return self.cache_data.get(key, None)
