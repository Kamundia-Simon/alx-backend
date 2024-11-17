#!/usr/bin/env python3
"""
LFUCache
"""
from base_caching import BaseCaching
from collections import OrderedDict


class LFUCache(BaseCaching):
    """LFUCache that inherits from BaseCaching and is a caching system"""
    def __init__(self):
        """class initialization"""
        super().__init__()
        self.cache_data = OrderedDict()
        self.usage_frequency = {}

    def put(self, key, item):
        """Adds an item."""
        if key is None or item is None:
            return

        if key not in self.cache_data:
            if len(self.cache_data) + 1 > BaseCaching.MAX_ITEMS:
                lfu_key = min(
                        self.usage_frequency,
                        key=lambda k:
                        (self.usage_frequency[k],
                         list(self.cache_data.keys()).index(k)
                         )
                        )
                self.cache_data.pop(lfu_key)
                self.usage_frequency.pop(lfu_key)
                print("DISCARD:", lfu_key)
            self.cache_data[key] = item
            self.usage_frequency[key] = 1
        else:
            self.cache_data[key] = item
            self.usage_frequency[key] += 1
        self.cache_data.move_to_end(key)

    def get(self, key):
        """Retrieve an item"""
        if key is not None and key in self.cache_data:
            self.usage_frequency[key] += 1
            self.cache_data.move_to_end(key)
            return self.cache_data[key]
        return None
