import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPublicVendors } from '../features/vendors/vendorSlice';
import Spinner from './Spinner';

const VendorCarousel = () => {
  const dispatch = useDispatch();
  const { list, status } = useSelector((state) => state.vendors);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPublicVendors({ featured: true, limit: 12 }));
    }
  }, [dispatch, status]);

  if (status === 'loading' && !list.length) {
    return (
      <div className="py-4">
        <Spinner />
      </div>
    );
  }

  if (!list.length) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Featured vendors</h2>
        <Link
          to="/vendors"
          className="text-xs text-indigo-600 font-semibold hover:text-indigo-700 hover:no-underline"
        >
          Browse all
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory custom-scrollbar">
        {list.map((v) => (
          <Link
            key={v._id}
            to={`/vendors/${v._id}`}
            className="min-w-[220px] sm:min-w-[260px] max-w-[260px] card p-4 flex items-center gap-3 hover:no-underline snap-start group"
          >
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm">
              {v.logo ? (
                <img
                  src={v.logo}
                  alt={v.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="text-sm font-semibold text-indigo-600">
                  {v.name?.[0] || 'V'}
                </span>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-indigo-700 transition-colors">
                {v.name}
              </p>
              {typeof v.rating === 'number' && (
                <p className="text-xs text-gray-500">
                  ⭐ {v.rating.toFixed(1)} / 5
                </p>
              )}
              {v.location && (
                <p className="text-xs text-gray-500 line-clamp-1">{v.location}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default VendorCarousel;

