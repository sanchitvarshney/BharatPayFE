import React from "react";
import FqcDeviceImageSearchForm from "./FqcDeviceImageSearchForm";
import FqcDeviceImageResults from "./FqcDeviceImageResults";
import FqcDeviceImagesModal from "./FqcDeviceImagesModal";
import FqcImagePreviewModal from "./FqcImagePreviewModal";
import { useFqcDeviceImage } from "./useFqcDeviceImage";

const FQCDeviceImagePage: React.FC = () => {
  const {
    deviceType,
    setDeviceType,
    filterBy,
    setFilterBy,
    dateRangeFilter,
    setDateRangeFilter,
    deviceTypeReport,
    setDeviceTypeReport,
    serialNo,
    setSerialNo,
    viewModalOpen,
    setViewModalOpen,
    previewModalOpen,
    setPreviewModalOpen,
    selectedRow,
    previewIdx,
    tableRows,
    availableViews,
    currentPreviewView,
    currentPreviewUrl,
    fqcDeviceImagesLoading,
    fqcDeviceImagesError,
    columnDefs,
    handleSearch,
    handleImageClick,
    handlePrevPreview,
    handleNextPreview,
    dateRange,
    setDateRange,
    isConnected,
    handleBulkDownload,
    page,
    limit,
    fqcPagination,
    handlePageChange,
    handleLimitChange,
  } = useFqcDeviceImage();

  return (
    <div className="relative flex bg-white">
      <FqcDeviceImageSearchForm
        deviceType={deviceType}
        deviceTypeReport={deviceTypeReport}
        filterBy={filterBy}
        onChangeFilterBy={setFilterBy}
        onChangeDeviceType={setDeviceTypeReport}
        serialNo={serialNo}
        loading={fqcDeviceImagesLoading}
        onDeviceTypeChange={setDeviceType}
        onSerialNoChange={setSerialNo}
        onSearch={handleSearch}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        dateRangeFilter={dateRangeFilter}
        onDateRangeFilterChange={setDateRangeFilter}
        isConnected={isConnected}
        onBulkDownload={handleBulkDownload}
      />

      <FqcDeviceImageResults
        loading={fqcDeviceImagesLoading}
        error={fqcDeviceImagesError}
        rows={tableRows}
        columnDefs={columnDefs}
        page={page}
        limit={limit}
        pagination={fqcPagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />

      <FqcDeviceImagesModal
        open={viewModalOpen}
        row={selectedRow}
        views={availableViews}
        onClose={() => setViewModalOpen(false)}
        onImageClick={handleImageClick}
      />

      <FqcImagePreviewModal
        open={previewModalOpen}
        label={currentPreviewView?.label ?? "Image Preview"}
        imageUrl={currentPreviewUrl}
        currentIndex={previewIdx}
        total={availableViews.length}
        onClose={() => setPreviewModalOpen(false)}
        onPrev={handlePrevPreview}
        onNext={handleNextPreview}
      />
    </div>
  );
};

export default FQCDeviceImagePage;
