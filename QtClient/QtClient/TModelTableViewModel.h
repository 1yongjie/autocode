#ifndef TModelTableViewModel_H
#define TModelTableViewModel_H

#include <QAbstractTableModel>
#include <QMap>
#include <QVariant>
#include <QVector>

struct TableDataItem {
    QMap<QString, QVariant> data;
    QMap<QString, QVariant> styleData;
};

class TModelTableViewModel : public QAbstractTableModel
{
    Q_OBJECT

public:
    explicit TModelTableViewModel(QObject* parent = nullptr);

    // 必需的虚函数
    int rowCount(const QModelIndex& parent = QModelIndex()) const override;
    int columnCount(const QModelIndex& parent = QModelIndex()) const override;
    QVariant data(const QModelIndex& index, int role = Qt::DisplayRole) const override;
    QVariant headerData(int section, Qt::Orientation orientation, int role = Qt::DisplayRole) const override;

    // 编辑支持
    bool setData(const QModelIndex& index, const QVariant& value, int role = Qt::EditRole) override;
    Qt::ItemFlags flags(const QModelIndex& index) const override;

    // 数据操作方法
    void setRowCount(int rows);
    void setColumnCount(int cols);
    void setHeaderLabels(const QStringList& labels);
    QStringList getHeaderLabels() const;
    void setDataAt(int row, int col, const QVariant& value);
    QVariant dataAt(int row, int col) const;
    void clearData();
    // 在类的公共方法部分添加
    void setDecimalPlacesForColumn(int column, int decimals);
    int getDecimalPlacesForColumn(int column) const;
    // 获取数据项
    TableDataItem* itemAt(int row);
    // 设置可编辑列
    void setEditableColumns(const QVector<int>& columns);
private:
    QVector<int> m_editableColumns; // 存储可编辑列的索引
    QVector<TableDataItem> tableData;
    QMap<QString, QMap<int, QVariant>> cellStyles;  // 存储每个单元格的角色数据
    QStringList headerLabels;
    int rows;
    int cols;
    QMap<int, int> decimalPlaces;  // 存储每列的小数位数，key为列索引，value为小数位数
};

#endif // TModelTableViewModel_H