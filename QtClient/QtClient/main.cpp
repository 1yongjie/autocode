#include "QtClient.h"
#include <QtWidgets/QApplication>
#include <QLabel>
#include <QTextCodec>
#include "mysqlhelper.h"

int main(int argc, char *argv[])
{    
    // 方法1：启用高DPI支持
    QApplication::setAttribute(Qt::AA_EnableHighDpiScaling);
    QApplication a(argc, argv);
    QtClient window;
    //QLabel* label = new QLabel("Hello Qt in Visual Studio!", &window);
    //label->setAlignment(Qt::AlignCenter);
        // 示例1: 查询数据
    
    QList<QVariantMap> datas = MySQLHelper::query(
        "SELECT id, username, email, created_at FROM users WHERE status = :status",
        { {"status", 1} }       
    );
    qDebug() << "查询到" << datas.size() << "条记录";
    for (const auto& p : datas) {
        qDebug() << "用户:" << p["username"].toString()
            << "邮箱:" << p["email"].toString();
    }
    
    //window.setCentralWidget(label);
    //window.resize(400, 300);
    window.show();
   
    return a.exec();
}
