// mainwindow.h
#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QStandardItemModel>
#include <QTableView>
#include <QHBoxLayout>
#include <QGroupBox>
#include <QCheckBox>
#include <QPushButton>
#include <QColorDialog>
#include <QLabel>
#include <QSpinBox>
#include <QComboBox>
#include <QHeaderView>
#include <QDebug>
#include <QMenu>
#include <QTimer>
#include <QMouseEvent>
#include <QAction>


// 前向声明
class TModelTableViewModel;

class StayOpenMenu : public QMenu {
    Q_OBJECT
public:
    explicit StayOpenMenu(const QString& title, QWidget* parent = nullptr)
        : QMenu(title, parent) {
    }

    explicit StayOpenMenu(QWidget* parent = nullptr)
        : QMenu(parent) {
    }

    // 重写 addMenu 方法，自动创建 StayOpenMenu 类型的子菜单
    QMenu* addMenu(const QString& title) {
        StayOpenMenu* menu = new StayOpenMenu(title, this);
        QMenu::addMenu(menu);
        return menu;
    }

    QMenu* addMenu(const QIcon& icon, const QString& title) {
        StayOpenMenu* menu = new StayOpenMenu(title, this);
        menu->setIcon(icon);
        QMenu::addMenu(menu);
        return menu;
    }

    // 添加需要保持打开的动作
    QAction* addStayOpenAction(const QString& text) {
        QAction* action = addAction(text);
        action->setCheckable(true);
        return action;
    }

protected:
    void mouseReleaseEvent(QMouseEvent* e) override {
        QAction* action = activeAction();
        if (action && action->isEnabled()) {
            QRect actionRect = actionGeometry(action);

            if (actionRect.contains(e->pos())) {
                // 检查是否是子菜单
                if (action->menu()) {
                    // 对于子菜单，让父类正常处理（会打开子菜单）
                    QMenu::mouseReleaseEvent(e);
                    return;
                }

                // 对于普通动作，如果可检查则保持打开
                if (action->isCheckable()) {
                    action->trigger();
                    setFocus();
                    e->accept();
                    return;
                }
            }
        }
        QMenu::mouseReleaseEvent(e);
    }

    void keyPressEvent(QKeyEvent* e) override {
        QAction* action = activeAction();
        if (action && action->isEnabled() &&
            (e->key() == Qt::Key_Enter || e->key() == Qt::Key_Return || e->key() == Qt::Key_Space)) {

            // 如果是子菜单，正常打开
            if (action->menu()) {
                QMenu::keyPressEvent(e);
                return;
            }

            // 对于可检查的动作，保持打开
            if (action->isCheckable()) {
                action->trigger();
                e->accept();
                return;
            }
        }
        QMenu::keyPressEvent(e);
    }
};

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    MainWindow(QWidget* parent = nullptr);
    ~MainWindow();

private slots:
    void toggleColumnVisibility(int column, bool visible);
    void changeColumnColor(int column);
    void updateTableData();
    void initializeRowVisibility();
   
    void showPartialDataAction(int i);
    void showAllDataAction();
    void resetToDefaults();
    void applyColumnWidth(int column, int width);
    void changeTextColor(int column);
    void changeFontSize(int column, int size);
    void toggleAlternatingRowColors(bool enabled);

    void showColumnContextMenu(const QPoint& pos);
    //void toggleColumnFromMenu();

private:

    QVector<bool> rowVisibility; // 记录每行的可见状态

    void setupUI();
    void setupTableModel();
    void setupConfigurationPanel();
    QGroupBox* createColumnControlGroup(int column, const QString& columnName);
    void updateColumnAppearance(int column);
    // 键盘事件处理
    void keyPressEvent(QKeyEvent* event) override;
   
    void onCellEditingFinished(QWidget* editor, QAbstractItemDelegate::EndEditHint hint);
    QGroupBox* createSalaryThresholdGroup(); // 添加此函数声明
    
    QMenu* columnVisibilityMenu;
    // UI 组件
    QWidget* centralWidget;
    QHBoxLayout* mainLayout;
    QTableView* tableView;
        // 在 MainWindow 类中添加

    int salaryThreshold = 8000;  // 薪资阈值
    QColor highSalaryColor = QColor(255, 100, 100);  // 高薪资背景色（浅红色）;
    TModelTableViewModel* tableModel;

    // 配置面板组件
    QVBoxLayout* configLayout;
    QGroupBox* configGroupBox;

    // 存储列配置
    struct ColumnConfig {
        bool visible;
        QColor backgroundColor;
        QColor textColor;
        int fontSize;
        int width;
    };

    QVector<ColumnConfig> columnConfigs;
    QVector<QGroupBox*> columnControlGroups;

    // 全局设置
    bool alternatingRowColors;
};

#endif // MAINWINDOW_H