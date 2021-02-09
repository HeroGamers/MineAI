@echo off

:start
:restart
java -Xms2G -Xmx2G -XX:+UseConcMarkSweepGC -XX:+UseParNewGC -XX:+CMSIncrementalPacing -XX:ParallelGCThreads=2 -XX:+AggressiveOpts -jar server.jar --nogui

goto restart
goto start