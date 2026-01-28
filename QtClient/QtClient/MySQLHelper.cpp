
#include "MySQLHelper.h"
#include <QSqlQuery>
#include <QSqlError>
#include <QDebug>

QSqlDatabase MySQLHelper::db;

bool MySQLHelper::connect(const QString& host, 
    const QString& dbName,
    const QString& user)
{
    disconnect();
    auto pass = QString::fromStdString("123");
    db = QSqlDatabase::addDatabase("QMYSQL", "mysql_connection");
    db.setHostName(host);
    db.setPort(3306);
    db.setDatabaseName(dbName);
    db.setUserName(user);
    db.setPassword(pass);

    return db.open();
}

QList<QVariantMap> MySQLHelper::query(const QString& sql,
    const QVariantMap& params)
{
    QList<QVariantMap> results;

    if (!db.isOpen()) {
        qWarning() << "数据库未连接";
        return results;
    }

    QSqlQuery query(db);
    query.prepare(sql);

    for (auto it = params.constBegin(); it != params.constEnd(); ++it) {
        query.bindValue(":" + it.key(), it.value());
    }

    if (!query.exec()) {
        qWarning() << "查询失败:" << query.lastError().text();
        return results;
    }

    while (query.next()) {
        QVariantMap row;
        QSqlRecord record = query.record();
        for (int i = 0; i < record.count(); ++i) {
            row[record.fieldName(i)] = query.value(i);
        }
        results.append(row);
    }

    return results;
}

void MySQLHelper::disconnect()
{
    if (db.isOpen()) {
        db.close();
    }

    if (QSqlDatabase::contains("mysql_connection")) {
        QSqlDatabase::removeDatabase("mysql_connection");
    }
}