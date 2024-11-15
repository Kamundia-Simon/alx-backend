#!/usr/bin/env python3
"""
Class the inherits from a caching system
"""
from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """inherits from a caching system"""
    def put(self, key, item):
        """If key or item is None do nothing"""
        if key is None or item is None:
            return
        self.cache_data[key] = item

    def get(self, key):
        """Get an item from the cache."""
        if key is None or key not in self.cache_data:
            return None
        return self.cache_data[key]
