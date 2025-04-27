import { NavLink } from 'react-router-dom';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export const NavItem = ({ item, expanded, onExpand }) => {
  const hasSubItems = item.subItems?.length > 0;

  return (
    <div className="space-y-1 px-2">
      <div
        className={`
          flex items-center justify-between p-2 rounded-lg
          ${hasSubItems ? 'cursor-pointer' : ''}
          ${expanded ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'}
        `}
        onClick={hasSubItems ? onExpand : undefined}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
      >
        <div className="flex items-center space-x-3">
          <span className="text-gray-400">{item.icon}</span>
          <span className="text-sm font-medium">{item.label}</span>
        </div>
        {hasSubItems && (
          <ChevronDownIcon
            className={`w-4 h-4 transform transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        )}
      </div>

      {hasSubItems && expanded && (
        <div className="ml-8 space-y-1">
          {item.subItems.map((subItem, subIndex) => (
            <NavLink
              key={subIndex}
              to={subItem.path}
              className={({ isActive }) =>
                `block px-3 py-1.5 text-sm rounded-lg transition-colors
                ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`
              }
            >
              {subItem.label}
            </NavLink>
          ))}
        </div>
      )}

      {!hasSubItems && item.path && (
        <NavLink
          to={item.path}
          end={item.exact}
          className={({ isActive }) =>
            `block px-3 py-1.5 text-sm rounded-lg transition-colors
            ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`
          }
        >
          {item.label}
        </NavLink>
      )}
    </div>
  );
};
