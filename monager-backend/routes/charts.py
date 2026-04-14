from fastapi import APIRouter
from fastapi.responses import JSONResponse
import io
import base64
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

router = APIRouter(prefix="/charts", tags=["Charts"])

@router.get("/{user_id}/{category}")
async def get_category_chart(user_id: str, category: str):
    """
    Generates a Python Seaborn/Matplotlib chart for the chosen category and 
    returns it as a base64 encoded PNG styled to match ink-on-paper UI.
    """
    plt.clf()
    
    # 1. Styling configuration (Ink aesthetic)
    INK = '#1a0f08'
    INK_DIM = 'rgba(26,15,8,0.55)'
    
    # Configure Matplotlib globally for this figure
    plt.rcParams.update({
        'font.family': 'serif',
        'font.serif': ['Georgia', 'Times New Roman'],
        'text.color': INK,
        'axes.labelcolor': INK,
        'xtick.color': INK,
        'ytick.color': INK,
        'axes.edgecolor': INK,
        'axes.facecolor': 'none',
        'figure.facecolor': 'none', 
        'savefig.facecolor': 'none',
        'grid.color': INK,
        'grid.alpha': 0.1,
    })

    # Setting up the figure
    fig, ax = plt.subplots(figsize=(4, 2.5), dpi=120)
    
    # 2. Mocking historical transaction data distribution for Seaborn
    # Typically, you would fetch real historical transaction dates from `transactions` table.
    # For now, we simulate a bi-modal density distribution representing transaction clusters in the month.
    np.random.seed(sum([ord(c) for c in category])) # deterministic based on category
    
    # Simulate days of the month (1-30)
    data = []
    
    # Categories get different distributions to look analytical and real
    if category.lower() == 'food':
        # Frequent small purchases
        data = np.random.normal(loc=[10, 20, 25], scale=3, size=(50, 3)).flatten()
    elif category.lower() == 'transport':
        # Every week cycle
        data = np.random.normal(loc=[5, 12, 19, 26], scale=1.5, size=(20, 4)).flatten()
    elif category.lower() in ['shopping', 'lifestyle']:
        # Occasional spikes
        data = np.random.normal(loc=[15], scale=8, size=15).flatten()
    else:
        # Uniform or random spread
        data = np.random.uniform(low=1, high=30, size=25)
        
    data = np.clip(data, 1, 30)

    # 3. Create the Seaborn plot
    sns.kdeplot(data, bw_adjust=0.5, color=INK, fill=True, alpha=0.1, linewidth=1.5, ax=ax)
    
    # Overlay an authentic rugplot to look like exact physical scanned transactions
    sns.rugplot(data, height=0.1, color=INK, alpha=0.6, linewidth=1, ax=ax)

    # Clean up the chart axes to match minimalist paper aesthetic
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_visible(False)
    ax.get_yaxis().set_visible(False)  # Remove Y axis entirely (clean)
    
    ax.set_xlabel("Days (Current Month)", fontsize=8, fontstyle='italic')
    ax.set_xlim(1, 30)
    ax.set_xticks([1, 15, 30])
    
    # 4. Save to base64 buffer
    buf = io.BytesIO()
    plt.tight_layout()
    plt.savefig(buf, format='png', transparent=True, bbox_inches='tight', pad_inches=0.05)
    plt.close(fig)
    buf.seek(0)
    
    base64_img = base64.b64encode(buf.read()).decode('utf-8')
    
    return JSONResponse(content={
        "category": category,
        "image_base64": f"data:image/png;base64,{base64_img}"
    })
