/*
 * Created on 2010-6-28 下午05:00:29
 * $Id$
 */
package aurora.application.features;

import uncertain.composite.CompositeMap;

/**
 * Interface to simplify lookup code feature 
 */
public interface ILookupCodeProvider {
    
    /**
     * Get all option list of a lookup, in CompositeMap
     * @param session_context A CompositeMap containing session data such as user_id, role_id 
     * @param lookup_code Code of lookup
     * @return A CompositeMap containing lookup options, each option as a child node, for example:
     * <options>
     *  <item value="0" prompt="Success" />
     *  <item value="-1" prompt="Fail" />
     * </options>
     */
    public CompositeMap getLookupList( CompositeMap session_context, String lookup_code );
    
    /**
     * Get prompt of a code
     * @param session_context A CompositeMap containing session data such as user_id, role_id
     * @param lookup_code Code of lookup
     * @param lookup_value Value of a item
     * @return Prompt according to specified value
     */
    public String getLookupPrompt( CompositeMap session_context, String lookup_code, Object lookup_value );

}
