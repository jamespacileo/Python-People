import os

# grab files and import views into package namespace

currPath = os.path.realpath(os.path.dirname(__file__))

dirFiles = []
for root, dirs, files in os.walk(currPath):
	for name in files:
		if name.endswith('.py') and not name.startswith('_'): 
			dirFiles.append(name.replace('.py', ''))

for f in dirFiles:
	exec("from %s import *" % (f))