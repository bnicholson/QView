#!/bin/bash
#
# Populate the sql data first
#
psql -d qviewdev <populate-testdata.sql
#
# Now it's time to start populating the event data
# from a huge eventlog.  This is used to test some of the apis
# and to create test data
#
../.cargo/.build/debug/replay 1000000 2&>/dev/null
