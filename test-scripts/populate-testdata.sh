#!/bin/bash
#
# Populate the sql data first
#
psql -d qviewdev <populate-testdata.sql
#
# Now it's time  
#
cd ..
.cargo/.build/debug/replay 1000000 >/dev/null
