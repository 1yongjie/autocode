#include "TModelTableViewModel.h"
#include <qabstractitemmodel.h>
#include <qglobal.h>
#include <qmetatype.h>
#include <qnamespace.h>
#include <qobject.h>
#include <qobjectdefs.h>
#include <qstring.h>
#include <qstringlist.h>
#include <qvariant.h>
#include <qvector.h>


TModelTableViewModel::TModelTableViewModel(QObject* parent)
	: QAbstractTableModel(parent)
	, rows(0)
	, cols(0)
{
	//headerLabels << "ID" << "姓名" << "部门" << "薪资" << "入职日期";
	//tableData.resize(rows);

	//// 初始化数据
	//for (int row = 0; row < rows; ++row) {
	//    for (int col = 0; col < cols; ++col) {
	//        QString key = QString::number(col);
	//        switch (col) {
	//        case 0: // ID
	//            tableData[row].data[key] = QString::number(row + 1001);
	//            break;
	//        case 1: // 姓名
	//            tableData[row].data[key] = QString("员工%1").arg(row);
	//            break;
	//        case 2: // 部门
	//            tableData[row].data[key] = "技术部";
	//            break;
	//        case 3: // 薪资
	//            tableData[row].data[key] = QString("￥%1").arg(5000 + (row * 1200));
	//            break;
	//        case 4: // 入职日期
	//            tableData[row].data[key] = "2020-03-15";
	//            break;
	//        }
	//    }
	//}
}

int TModelTableViewModel::rowCount(const QModelIndex& parent) const
{
	Q_UNUSED(parent);
	return rows;
}

int TModelTableViewModel::columnCount(const QModelIndex& parent) const
{
	Q_UNUSED(parent);
	return cols;
}
QVariant TModelTableViewModel::data(const QModelIndex& index, int role) const
{
	if (!index.isValid() || index.row() >= rows || index.column() >= cols) {
		return QVariant();
	}

	const TableDataItem& item = tableData[index.row()];
	QString key = QString("%1_%2").arg(index.row()).arg(index.column());
	switch (role) {
	case Qt::DisplayRole:
	case Qt::EditRole: {
		if (item.data.contains(QString::number(index.column()))) {
			QVariant value = item.data[QString::number(index.column())];
			if (decimalPlaces.contains(index.column())) {
				// 检查是否为数值类型并需要格式化
				bool isNumeric = value.type() == QVariant::Double ||
					value.type() == QVariant::Int ||
					value.type() == QVariant::LongLong ||
					value.type() == QMetaType::Float ||
					value.userType() == QMetaType::Float ||
					value.canConvert<double>();
				if (isNumeric) {
					int decimals = getDecimalPlacesForColumn(index.column());
					return QString::number(value.toDouble(), 'f', decimals);
				}
			}
			return value;
		}
		break;
	}
	case Qt::TextAlignmentRole: {
		return Qt::AlignCenter;
	}
	case Qt::BackgroundRole:
	case Qt::ForegroundRole:
	case Qt::FontRole: {
		// 检查是否有自定义样式
		if (cellStyles.contains(key) && cellStyles[key].contains(role)) {
			return cellStyles[key][role];
		}
		break;
	}
	}

	return QVariant();
}


QVariant TModelTableViewModel::headerData(int section, Qt::Orientation orientation, int role) const
{
	if (role != Qt::DisplayRole) {
		return QVariant();
	}

	if (orientation == Qt::Horizontal && section < headerLabels.size()) {
		return headerLabels[section];
	}

	if (orientation == Qt::Vertical) {
		return QString::number(section + 1); // 行号从1开始
	}

	return QVariant();
}

bool TModelTableViewModel::setData(const QModelIndex& index, const QVariant& value, int role)
{
	if (!index.isValid() || index.row() >= rows || index.column() >= cols) {
		return false;
	}

	QString key = QString("%1_%2").arg(index.row()).arg(index.column());

	if (role == Qt::EditRole || role == Qt::DisplayRole) {
		tableData[index.row()].data[QString::number(index.column())] = value;
	}
	else {
		// 处理样式相关的角色
		cellStyles[key][role] = value;
	}

	emit dataChanged(index, index, { role });
	return true;
}
Qt::ItemFlags TModelTableViewModel::flags(const QModelIndex& index) const
{
	Qt::ItemFlags flags = QAbstractTableModel::flags(index);


	if (m_editableColumns.contains(index.column())) {
		flags |= Qt::ItemIsEditable;
	}
	return flags;
}

void TModelTableViewModel::setEditableColumns(const QVector<int>& columns)
{
	beginResetModel();
	m_editableColumns = columns;
	endResetModel();
}

void TModelTableViewModel::setRowCount(int rows)
{
	if (rows <= 0) return;

	int oldRows = this->rows;
	this->rows = rows;

	if (rows > oldRows) {
		// 添加新行
		beginInsertRows(QModelIndex(), oldRows, rows - 1);
		tableData.resize(rows);
		for (int i = oldRows; i < rows; ++i) {
			for (int col = 0; col < cols; ++col) {
				QString key = QString::number(col);
				switch (col) {
				case 0: // ID
					tableData[i].data[key] = QString::number(i + 1001);
					break;
				case 1: // 姓名
					tableData[i].data[key] = QString("员工%1").arg(i);
					break;
				case 2: // 部门
					tableData[i].data[key] = "技术部";
					break;
				case 3: // 薪资
					tableData[i].data[key] = QString("￥%1").arg(5000 + (i * 1200));
					break;
				case 4: // 入职日期
					tableData[i].data[key] = "2020-03-15";
					break;
				}
			}
		}
		endInsertRows();
	}
	else if (rows < oldRows) {
		// 删除多余行
		beginRemoveRows(QModelIndex(), rows, oldRows - 1);
		tableData.resize(rows);
		endRemoveRows();
	}
}

void TModelTableViewModel::setColumnCount(int cols)
{
	if (cols <= 0) return;

	int oldCols = this->cols;
	this->cols = cols;

	// 调整所有行的数据
	for (int row = 0; row < rows; ++row) {
		for (int col = oldCols; col < cols; ++col) {
			QString key = QString::number(col);
			tableData[row].data[key] = QString("列%1").arg(col);
		}
	}

	// 如果列数减少，不需要删除数据，因为QMap会自动处理
	this->cols = cols;
}

void TModelTableViewModel::setHeaderLabels(const QStringList& labels)
{
	headerLabels = labels;
	emit headerDataChanged(Qt::Horizontal, 0, labels.size() - 1);
}

QStringList TModelTableViewModel::getHeaderLabels() const
{
	return headerLabels;
}

void TModelTableViewModel::setDataAt(int row, int col, const QVariant& value)
{
	if (row >= 0 && row < rows && col >= 0 && col < cols) {
		QString key = QString::number(col);
		tableData[row].data[key] = value;

		QModelIndex index = this->index(row, col);
		emit dataChanged(index, index);
	}
}

QVariant TModelTableViewModel::dataAt(int row, int col) const
{
	if (row >= 0 && row < rows && col >= 0 && col < cols) {
		QString key = QString::number(col);
		return tableData[row].data.value(key);
	}
	return QVariant();
}

void TModelTableViewModel::clearData()
{
	beginResetModel();
	tableData.clear();
	tableData.resize(rows);
	endResetModel();
}
// 在.cpp文件中添加实现
void TModelTableViewModel::setDecimalPlacesForColumn(int column, int decimals)
{
	if (column >= 0 && decimals >= 0) {
		decimalPlaces[column] = decimals;
		// 刷新视图以应用更改
		emit dataChanged(index(0, column), index(rowCount() - 1, column));
	}
}

int TModelTableViewModel::getDecimalPlacesForColumn(int column) const
{
	if (decimalPlaces.contains(column)) {
		return decimalPlaces[column];
	}
	// 默认返回2位小数
	return 2;
}

TableDataItem* TModelTableViewModel::itemAt(int row)
{
	if (row >= 0 && row < rows) {
		return &tableData[row];
	}
	return nullptr;
}