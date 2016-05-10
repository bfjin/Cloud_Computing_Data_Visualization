import couchdb
import csv

POSITIVE_SENT = 1
NEGATIVE_SENT = -1
NEUTRAL_SENT = 0


def search_data(dbname, topic, aurin_data, output_path):
    """
    Aggregate all income and sentiment/happiness measure
    """

    topic = "topic" + str(topic)

    couch = couchdb.Server("http://115.146.94.116:5984/")
    db = couch[dbname]

    mapreduce = '''function(doc) { 
    if (doc.coordinates != null)
        emit(doc.sla, doc.sentiment);
    }'''

    option = {'map': mapreduce}

    ddoc = db.get("_design/sla")
    if ddoc:
        ddoc["views"][topic] = option
        db.save(ddoc)
    else:
        design = {'views': {topic: option}}
        db["_design/sla"] = design

    result = db.view('sla/' + topic)

    sla_dict = {}
    for row in result:
        sentiment = row.key["sentiment"]
        sla = row.key["sla"]
        if sla in set(sla_dict.keys()):
            if sentiment == POSITIVE_SENT:
                sla_dict[sla]["positive_count"] += 1
            elif sentiment == NEGATIVE_SENT:
                sla_dict[sla]["negative_count"] += 1
            elif sentiment == NEUTRAL_SENT:
                sla_dict[sla]["neutral_count"] += 1
        else:
            sla_dict[sla] = {}
            sla_dict[sla]["positive_count"] = 0
            sla_dict[sla]["negative_count"] = 0
            sla_dict[sla]["neutral_count"] = 0

    with open(aurin_data) as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            sla = row[0]
            income = row[1]
            pos_c = float(sla_dict[sla]["positive_count"])
            neg_c = float(sla_dict[sla]["negative_count"])
            neu_c = float(sla_dict[sla]["neutral_count"])
            happiness = pos_c / (pos_c + neg_c + neu_c)
            sla_dict[sla]["income"] = income
            sla_dict[sla]["happiness"] = happiness

    file_path = output_path
    with open(file_path, 'w') as csvfile:
        csvfile.write('SLA,Income,Happiness')
        for sla in sla_dict.keys():
            income = sla_dict[sla]["income"]
            happiness = sla_dict[sla]["happiness"]
            csvfile.write('{0},{1},{2}\n'.format(sla, income, happiness))
