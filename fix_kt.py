import os
import glob

base_dir = r'd:\Project Pdd Final\android-app\app\src\main\java\com\globalchain\ui\screens'

# Fix HorizontalDivider -> Divider in all files
for filepath in glob.glob(os.path.join(base_dir, '**', '*.kt'), recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    
    if 'HorizontalDivider' in content:
        content = content.replace('HorizontalDivider', 'Divider')
        modified = True
        
    if 'progress = {' in content and 'LinearProgressIndicator' in content:
        content = content.replace('progress = { (s.healthScore / 100).toFloat() }', 'progress = (s.healthScore / 100).toFloat()')
        content = content.replace('progress = { value / 100f }', 'progress = value / 100f')
        content = content.replace('progress = { risk / 100f }', 'progress = risk / 100f')
        modified = True

    if 'verticalScroll' in content and 'import androidx.compose.foundation.verticalScroll' not in content:
        content = content.replace('import androidx.compose.foundation.layout.*', 'import androidx.compose.foundation.layout.*\nimport androidx.compose.foundation.verticalScroll')
        modified = True
        
    if 'kotlinx.coroutines.GlobalScope.launch' in content:
        if 'import kotlinx.coroutines.launch' not in content:
            content = content.replace('import androidx.compose.foundation.background', 'import kotlinx.coroutines.launch\nimport kotlinx.coroutines.delay\nimport androidx.compose.foundation.background')
            modified = True

    if filepath.endswith('SimulationScreens.kt') or filepath.endswith('SettingsScreens.kt'):
        if '@file:OptIn(ExperimentalMaterial3Api::class)' not in content:
            content = '@file:OptIn(ExperimentalMaterial3Api::class)\n' + content
            modified = True
            
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Fixed {filepath}')
