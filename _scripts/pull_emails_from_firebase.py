import json
import os
from datetime import datetime
from firebase import firebase
from mailsnake import MailSnake
from mailsnake.exceptions import *

batches = []

ms = MailSnake('0ffe3bf01dafb47436bf81d47c6dae22-us4')

firebaseapp = firebase.FirebaseApplication(
  'https://internproject.firebaseio.com',
  None
)
firebaseapp.authentication = firebase.FirebaseAuthentication(
  'pRUr2LaCuvLszUCioUYRFvbDpMYAzaOZd4joMkNJ',
  'wearetheinternproject@gmail.com'
)

signedup_on_firebase = firebaseapp.get('/email-signup', None)

last_pull_datetime = datetime.fromtimestamp(int(
    os.getenv('last_sync_stamp',
              datetime(2013, 06, 25).strftime('%s'))
))

date_format = '%m/%d/%Y %X'

signedup_recently = [user['email'] for user in signedup_on_firebase.values()
    if datetime.strptime(user['submit_time'], date_format) >
       last_pull_datetime
]

for e in signedup_recently:
	email = {'EMAIL': e}
	batches.append(email)

try:
    ms.listBatchSubscribe(id='d7bce2ac5d', batch=batches, double_optin=False) # returns "Everything's Chimpy!"
    ms.listBatchSubscribe(id='b83180baa4', batch=batches, double_optin=False) # returns "Everything's Chimpy!"
    mailchimp_worked = True
except MailSnakeException:
    print 'An error occurred. :('

#{u'email': u'drajeshree@gwu.edu', u'location': u', ', u'submit_time': u'06/07/2013 19:07:26'}

# TODO Send to mailchimp here then set variable to true
print batches

if mailchimp_worked:
  print "Ran successfully at {}".format(datetime.now())
  print "{} emails since last time".format(len(signedup_recently))
  os.putenv('last_sync_stamp', datetime.now().strtime('%s'))
