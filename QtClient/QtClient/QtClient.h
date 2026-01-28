#pragma once

#include <QtWidgets/QMainWindow>
#include "ui_QtClient.h"
#include <QDebug>


class QtClient : public QMainWindow
{
    Q_OBJECT

public:
    QtClient(QWidget *parent = nullptr);
    ~QtClient();
private slots:
    void on_pushButton_clicked();  // 自动连接
    void on_pushButton_2_clicked();  // 自动连接
    void on_pushButton_3_clicked();  // 自动连接
    void on_toolButton_clicked();  // 自动连接
private:
    Ui::QtClientClass ui;

};
