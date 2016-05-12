#!/usr/bin/env python

"""
Team: Cluster and Cloud Computing Team 3
Contents: Assigment 2
Authors: Kimple Ke
"""

import os
import sys

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "data_visualization.settings")

    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
