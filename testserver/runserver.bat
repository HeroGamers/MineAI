@echo off

:start
:restart
java -Xms6G -Xmx6G -XX:+UseConcMarkSweepGC -XX:+UseParNewGC -XX:+CMSIncrementalPacing -XX:ParallelGCThreads=2 -XX:+AggressiveOpts -jar paper-1.16.4-406.jar --nogui

goto restart
goto start