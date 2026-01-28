

#include <QSqlDatabase>
#include <QSqlQuery>
#include <QSqlError>
#include <QSqlRecord>  // 添加这个头文件
#include <QString>
#include <QVariant>
#include <QList>
#include <QVariantMap>

class MySQLHelper
{
public:
    // 连接数据库
    static bool connect(const QString& host, 
        const QString& dbName,
        const QString& user);

    // 查询方法
    static QList<QVariantMap> query(const QString& sql,
        const QVariantMap& params = QVariantMap());

    // 关闭连接
    static void disconnect();

private:
    static QSqlDatabase db;
};

