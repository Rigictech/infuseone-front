import React from 'react';
import { Pagination as BootstrapPagination } from 'react-bootstrap';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    totalRecords,
    startIndex,
    endIndex
}) => {
    if (totalPages <= 1) return null;

    // Helper to generate page numbers
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="d-flex justify-content-between align-items-center py-3 px-2">
            <div className="text-muted small">
                Showing <span className="fw-bold">{startIndex}</span> to <span className="fw-bold">{endIndex}</span> of <span className="fw-bold">{totalRecords}</span> entries
            </div>
            <BootstrapPagination className="mb-0 gap-1">
                <BootstrapPagination.Prev
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border-0"
                >
                    <ChevronLeft size={16} />
                </BootstrapPagination.Prev>

                {getPageNumbers().map(pageNum => (
                    <BootstrapPagination.Item
                        key={pageNum}
                        active={pageNum === currentPage}
                        onClick={() => onPageChange(pageNum)}
                        style={{
                            backgroundColor: pageNum === currentPage ? '#003366' : 'transparent',
                            borderColor: pageNum === currentPage ? '#003366' : '#dee2e6',
                            color: pageNum === currentPage ? 'white' : '#6c757d'
                        }}
                    >
                        {pageNum}
                    </BootstrapPagination.Item>
                ))}

                <BootstrapPagination.Next
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="border-0"
                >
                    <ChevronRight size={16} />
                </BootstrapPagination.Next>
            </BootstrapPagination>
        </div>
    );
};

export default Pagination;
